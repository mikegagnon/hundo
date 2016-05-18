
// This code was written by annakata on stackoverflow.com
// http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
// The code is licensed under the Creative Commons, Attribution-ShareAlike 3.0
// Unported (CC BY-SA 3.0)

Object.prototype.equals = function(x)
{
    for(p in this)
    {
        switch(typeof(this[p]))
        {
            case 'object':
                if (!this[p].equals(x[p])) { return false }; break;
            case 'function':
                if (typeof(x[p])=='undefined' || (p != 'equals' && this[p].toString() != x[p].toString())) { return false; }; break;
            default:
                if (this[p] != x[p]) { return false; }
        }
    }

    for(p in x)
    {
        if(typeof(this[p])=='undefined') {return false;}
    }

    return true;
}